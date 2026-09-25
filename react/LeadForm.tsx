import React, { FormEvent, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'leadFormContainer',
  'leadFormTitle',
  'leadFormField',
  'leadFormLabel',
  'leadFormInput',
  'leadFormCheckboxWrapper',
  'leadFormSubmit',
  'leadFormError',
  'leadFormSuccess',
] as const

interface FormState {
  firstName: string
  lastName: string
  email: string
  interestCategory: string
  optIn: boolean
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  interestCategory: '',
  optIn: false,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'submitting' | 'success' | 'error'

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {}

  if (!form.firstName.trim()) errors.firstName = 'Informe o nome'
  if (!form.lastName.trim()) errors.lastName = 'Informe o sobrenome'
  if (!form.email.trim()) {
    errors.email = 'Informe o e-mail'
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'E-mail inválido'
  }
  if (!form.interestCategory.trim()) errors.interestCategory = 'Informe a categoria de interesse'

  return errors
}

function LeadForm() {
  const handles = useCssHandles(CSS_HANDLES)
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      field === 'optIn'
        ? (event.target as HTMLInputElement).checked
        : event.target.value

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setStatus('submitting')

    try {
      // Chamada direta ao Master Data: a entidade LD tem esses campos liberados
      // para escrita pública (v-security.publicWrite), então não precisa de backend.
      const response = await fetch('/api/dataentities/LD/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vtex.ds.v10+json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      setForm(INITIAL_STATE)
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className={`${handles.leadFormContainer} pa6 mw6 center`}>
      <h2 className={`${handles.leadFormTitle} t-heading-4 mb5`}>
        Cadastre-se e receba novidades
      </h2>
      <form onSubmit={handleSubmit}>
        <div className={`${handles.leadFormField} mb4`}>
          <label className={`${handles.leadFormLabel} db mb2`} htmlFor="firstName">
            Nome
          </label>
          <input
            id="firstName"
            className={`${handles.leadFormInput} w-100 pa3 ba b--muted-3 br2`}
            type="text"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
          {errors.firstName && (
            <span className={`${handles.leadFormError} c-danger f6`}>{errors.firstName}</span>
          )}
        </div>

        <div className={`${handles.leadFormField} mb4`}>
          <label className={`${handles.leadFormLabel} db mb2`} htmlFor="lastName">
            Sobrenome
          </label>
          <input
            id="lastName"
            className={`${handles.leadFormInput} w-100 pa3 ba b--muted-3 br2`}
            type="text"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
          {errors.lastName && (
            <span className={`${handles.leadFormError} c-danger f6`}>{errors.lastName}</span>
          )}
        </div>

        <div className={`${handles.leadFormField} mb4`}>
          <label className={`${handles.leadFormLabel} db mb2`} htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            className={`${handles.leadFormInput} w-100 pa3 ba b--muted-3 br2`}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />
          {errors.email && (
            <span className={`${handles.leadFormError} c-danger f6`}>{errors.email}</span>
          )}
        </div>

        <div className={`${handles.leadFormField} mb4`}>
          <label className={`${handles.leadFormLabel} db mb2`} htmlFor="interestCategory">
            Categoria de interesse
          </label>
          <input
            id="interestCategory"
            className={`${handles.leadFormInput} w-100 pa3 ba b--muted-3 br2`}
            type="text"
            value={form.interestCategory}
            onChange={handleChange('interestCategory')}
          />
          {errors.interestCategory && (
            <span className={`${handles.leadFormError} c-danger f6`}>
              {errors.interestCategory}
            </span>
          )}
        </div>

        <div className={`${handles.leadFormCheckboxWrapper} mb5 flex items-center`}>
          <input
            id="optIn"
            type="checkbox"
            checked={form.optIn}
            onChange={handleChange('optIn')}
          />
          <label className="ml2" htmlFor="optIn">
            Aceito receber comunicações por e-mail
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`${handles.leadFormSubmit} pa3 bg-emphasis c-on-emphasis br2 bn w-100`}
        >
          {status === 'submitting' ? 'Enviando...' : 'Cadastrar'}
        </button>

        {status === 'success' && (
          <p className={`${handles.leadFormSuccess} c-success mt4`}>
            Cadastro realizado com sucesso!
          </p>
        )}
        {status === 'error' && (
          <p className={`${handles.leadFormError} c-danger mt4`}>
            Não foi possível enviar seu cadastro. Tente novamente.
          </p>
        )}
      </form>
    </div>
  )
}

export default LeadForm
