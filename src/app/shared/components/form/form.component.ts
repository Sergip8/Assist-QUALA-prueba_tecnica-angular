import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError, takeUntil, from } from 'rxjs';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'datetime-local' | 'search';
  placeholder?: string;
  required?: boolean;
  validators?: any[];
  options?: { value: any; label: string }[];
  rows?: number;
  disabled?: boolean;
  value?: any;
  errorMessages?: { [key: string]: string };
  searchConfig?: {
    apiCall: (searchTerm: string) => Promise<any[]>;
    valueKey: string;
    labelKey: string;
  };
}

export interface FormConfig {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}


@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() config!: FormConfig;
  @Input() initialData?: any;
  @Input() inModal = true;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  form!: FormGroup;
  searchResults: { [key: string]: any[] } = {};
  searchLoading: { [key: string]: boolean } = {};
  labelSelected: { [key: string]: boolean } = {};

  private destroy$ = new Subject<void>();

  private searchSubjects: { [key: string]: Subject<string> } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.setupSearchFields();
  }

  ngOnDestroy(): void {
    console.log('FormComponent: Iniciando destrucción...');
    this.destroy$.next();
    this.destroy$.complete();
    Object.keys(this.searchSubjects).forEach(fieldName => {
      if (this.searchSubjects[fieldName]) {
        this.searchSubjects[fieldName].complete();
        delete this.searchSubjects[fieldName];
      }
    });
    

    this.searchResults = {};
    this.searchLoading = {};
  
    if (this.form) {
      this.form.reset();
    }
    
    console.log('FormComponent: Destrucción completada');
  }

  private buildForm(): void {
    const formControls: { [key: string]: any } = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.initialData?.[field.name] || field.value || this.getDefaultValue(field);
      
      formControls[field.name] = [
        { value: initialValue, disabled: field.disabled },
        validators
      ];
    });

    this.form = this.fb.group(formControls);
  }

  private buildValidators(field: FormField): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    switch (field.type) {
      case 'email':
        validators.push(Validators.email);
        break;
      case 'number':
        validators.push(Validators.pattern(/^\d+$/));
        break;
      case 'url':
        validators.push(Validators.pattern(/^https?:\/\/.+/));
        break;
    }

    if (field.validators) {
      validators.push(...field.validators);
    }

    return validators;
  }

  private getDefaultValue(field: FormField): any {
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'number':
        return null;
      default:
        return '';
    }
  }

  private setupSearchFields(): void {
    this.config.fields.forEach(field => {
      if (field.type === 'search' && field.searchConfig) {
   
        this.searchSubjects[field.name] = new Subject<string>();
        this.searchResults[field.name] = [];
        this.searchLoading[field.name] = false;

   
        this.searchSubjects[field.name]
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$), 
            switchMap(term => {
              console.log(`[${field.name}] Término de búsqueda recibido: "${term}"`);
              
              if (!term || term.length < 2) {
                console.log(`[${field.name}] Término demasiado corto o vacío.`);
                return of([]);
              }
              
              this.searchLoading[field.name] = true;
              console.log(`[${field.name}] Realizando llamada a la API con término: "${term}"`);
              
              // ✅ Convertir Promise a Observable correctamente
              return from(field.searchConfig!.apiCall(term)).pipe(
                catchError(error => {
                  console.error(`[${field.name}] Error en la llamada a la API:`, error);
                  this.searchLoading[field.name] = false;
                  return of([]);
                }),
                takeUntil(this.destroy$) 
              );
            }),
            catchError(error => {
              console.error(`[${field.name}] Error en el pipe de búsqueda:`, error);
              this.searchLoading[field.name] = false;
              return of([]);
            })
          )
          .subscribe({
            next: (results) => {
              if (!this.destroy$.closed) {
                this.searchResults[field.name] = results || [];
                this.searchLoading[field.name] = false;
                console.log(results)
                console.log(`[${field.name}] Resultados procesados:`, results?.length || 0);
              }
            },
            error: (err) => {
              console.error(`[${field.name}] Error en la suscripción de búsqueda:`, err);
              if (!this.destroy$.closed) {
                this.searchLoading[field.name] = false;
              }
            }
          });
      }
    });
  }

  onSearchInput(fieldName: string, value: string): void {
    console.log(`[onSearchInput] Campo: ${fieldName}, Valor: "${value}"`);
    if (this.searchSubjects[fieldName] && !this.destroy$.closed) {
      this.searchSubjects[fieldName].next(value);
    }
  }

  onSearchSelect(fieldName: string, selectedItem: any): void {
    if (this.destroy$.closed) return; 
    this.labelSelected[fieldName] = selectedItem.nombre
    const field = this.config.fields.find(f => f.name === fieldName);
    if (field?.searchConfig) {
      const value = selectedItem[field.searchConfig.valueKey];
      this.form.get(fieldName)?.setValue(value);
      this.searchResults[fieldName] = [];
      console.log(`[onSearchSelect] Campo: ${fieldName}, Valor seleccionado: ${value}`);
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      const field = this.config.fields.find(f => f.name === fieldName);
      
      if (field?.errorMessages) {
        for (const errorType in control.errors) {
          if (field.errorMessages[errorType]) {
            return field.errorMessages[errorType];
          }
        }
      }

      // Mensajes por defecto
      if (control.errors['required']) return `${field?.label} es requerido`;
      if (control.errors['email']) return 'Ingrese un email válido';
      if (control.errors['pattern']) return `${field?.label} tiene formato inválido`;
    }
    return "";
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  handleSubmit(): void {
    if (this.destroy$.closed) return;
    
    if (this.form.valid) {
     
      console.log('Formulario válido, emitiendo onSubmit:', this.form.getRawValue());
      this.onSubmit.emit(this.form.getRawValue());
    } else {
      console.log('Formulario inválido, marcando campos como tocados.');
      this.markFormGroupTouched();
    }
  }
  handleCancel(): void {
    if (this.destroy$.closed) return; 
    
    console.log('Botón Cancelar presionado.');
    this.onCancel.emit();
  }

  private markFormGroupTouched(): void {
    if (this.destroy$.closed) return;
    
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }
}