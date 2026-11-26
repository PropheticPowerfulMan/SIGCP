import React, { useId, useRef, useState } from 'react';
import { Inbox, Send, Check, LoaderCircle } from 'lucide-react';
import { assignees, channels, createMail, institutions, isValidDate, priorities, services, shiftDate, today } from './domain.ts';
import type { Mail, MailInput, MailKind } from './domain.ts';
import { Modal, Notice } from './ui';

type CreateFormProps = {
  defaults: Partial<MailInput>;
  existing: Mail[];
  onClose: () => void;
  onSave: (mail: Mail) => void;
};
type FieldName = keyof MailInput;

export function CreateForm({ defaults, existing, onClose, onSave }: CreateFormProps) {
  const prefix = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const deadlineEdited = useRef(Boolean(defaults.dueDate));
  const saving = useRef(false);
  const [values, setValues] = useState<MailInput>(() => {
    const kind = defaults.kind || 'entrant';
    const date = defaults.date || today();
    const institution = institutions.find(item => item.id === defaults.institutionId) || institutions[0];
    return {
      subject: defaults.subject || '',
      sender: defaults.sender || (kind === 'sortant' ? institutions[0].name : ''),
      recipient: defaults.recipient || (kind === 'sortant' ? institution.name : 'Espace pilote IMPERIUM RDC'),
      service: defaults.service || services[0],
      kind,
      priority: defaults.priority || 'Normale',
      channel: defaults.channel || channels[0],
      date,
      dueDate: defaults.dueDate || shiftDate(date, 7),
      assignee: defaults.assignee || assignees[0],
      institutionId: institution.id,
      notes: defaults.notes || '',
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fieldId = (name: FieldName) => `${prefix}-${name}`;
  const errorId = (name: FieldName) => `${fieldId(name)}-error`;
  const errorProps = (name: FieldName) => ({
    'aria-invalid': errors[name] ? true as const : undefined,
    'aria-describedby': errors[name] ? errorId(name) : undefined,
  });
  const fieldError = (name: FieldName) => errors[name]
    ? <span className="field-error" id={errorId(name)}>{errors[name]}</span>
    : null;
  const update = <K extends FieldName>(name: K, value: MailInput[K]) => {
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    setFormError('');
  };
  function changeKind(kind: MailKind) {
    if (values.kind === kind) return;
    setValues(current => ({
      ...current,
      kind,
      sender: !current.sender || current.sender === institutions[0].name
        ? kind === 'sortant' ? institutions[0].name : ''
        : current.sender,
      recipient: !current.recipient || current.recipient === 'Espace pilote IMPERIUM RDC' || institutions.some(item => item.name === current.recipient)
        ? kind === 'sortant'
          ? (institutions.find(item => item.id === current.institutionId) || institutions[0]).name
          : 'Espace pilote IMPERIUM RDC'
        : current.recipient,
    }));
    setErrors({});
    setFormError('');
  }
  function changeDate(value: string) {
    update('date', value);
    if (!deadlineEdited.current && isValidDate(value)) update('dueDate', shiftDate(value, 7));
  }
  function changeInstitution(value: string) {
    update('institutionId', value);
    const institution = institutions.find(item => item.id === value);
    if (!institution) return;
    if (values.kind === 'sortant' && (!values.recipient || institutions.some(item => item.name === values.recipient))) update('recipient', institution.name);
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;
    const result = createMail(values, existing);
    if (!result.ok) {
      setErrors(result.errors || {});
      setFormError(result.error);
      const first = Object.keys(result.errors || {})[0];
      requestAnimationFrame(() => {
        const target = first ? formRef.current?.elements.namedItem(first) : null;
        if (target instanceof HTMLElement) target.focus();
      });
      return;
    }
    saving.current = true;
    setIsSaving(true);
    try {
      onSave(result.value);
    } catch {
      setFormError('Le courrier n’a pas pu être enregistré. Vérifiez le stockage du navigateur et réessayez.');
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }
  const hasErrors = Boolean(formError || Object.keys(errors).length);

  return <Modal title="Enregistrer un courrier fictif" onClose={onClose} wide>
    <Notice>Utilisez exclusivement des informations fictives. Ce courrier est conservé dans le navigateur ; aucun message ni document réel n’est transmis.</Notice>
    <form className="mail-form" ref={formRef} onSubmit={submit} noValidate aria-label="Nouveau courrier fictif" aria-busy={isSaving}>
      {hasErrors && <div className="form-errors" role="alert">
        <strong>{formError || 'Vérifiez les champs signalés.'}</strong>
        {Object.keys(errors).length > 0 && <ul>{Object.entries(errors).map(([name, message]) => <li key={name}><a href={`#${fieldId(name as FieldName)}`}>{message}</a></li>)}</ul>}
      </div>}
      <div className="form-section-heading"><span>Type de correspondance</span><small>Tous les champs marqués * sont obligatoires.</small></div>
      <div className="form-kind" role="group" aria-label="Type de correspondance">
        <button type="button" className={values.kind === 'entrant' ? 'selected' : ''} aria-pressed={values.kind === 'entrant'} onClick={() => changeKind('entrant')}><Inbox size={19} /><span>Courrier entrant</span></button>
        <button type="button" className={values.kind === 'sortant' ? 'selected' : ''} aria-pressed={values.kind === 'sortant'} onClick={() => changeKind('sortant')}><Send size={19} /><span>Courrier sortant</span></button>
      </div>
      {fieldError('kind')}
      <div className="form-section-heading"><span>Informations de la correspondance</span></div>
      <label htmlFor={fieldId('subject')}>Objet du courrier *
        <input id={fieldId('subject')} name="subject" value={values.subject} onChange={event => update('subject', event.target.value)} required minLength={5} maxLength={180} placeholder="Ex. Programme pilote de modernisation documentaire" {...errorProps('subject')} />
        {fieldError('subject')}
      </label>
      <div className="form-grid">
        <label htmlFor={fieldId('sender')}>Expéditeur fictif *
          <input id={fieldId('sender')} name="sender" value={values.sender} onChange={event => update('sender', event.target.value)} required minLength={3} maxLength={120} placeholder="Ex. Institution partenaire B" {...errorProps('sender')} />
          {fieldError('sender')}
        </label>
        <label htmlFor={fieldId('recipient')}>Destinataire fictif
          <input id={fieldId('recipient')} name="recipient" value={values.recipient} onChange={event => update('recipient', event.target.value)} maxLength={120} placeholder="Espace pilote destinataire" {...errorProps('recipient')} />
          {fieldError('recipient')}
        </label>
      </div>
      <div className="form-grid">
        <label htmlFor={fieldId('institutionId')}>Institution du dossier *
          <select id={fieldId('institutionId')} name="institutionId" value={values.institutionId} onChange={event => changeInstitution(event.target.value)} required {...errorProps('institutionId')}>{institutions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
          {fieldError('institutionId')}
        </label>
        <label htmlFor={fieldId('channel')}>Canal de réception *
          <select id={fieldId('channel')} name="channel" value={values.channel} onChange={event => update('channel', event.target.value as MailInput['channel'])} required {...errorProps('channel')}>{channels.map(channel => <option key={channel}>{channel}</option>)}</select>
          {fieldError('channel')}
        </label>
      </div>
      <div className="form-section-heading"><span>Affectation et suivi</span></div>
      <div className="form-grid">
        <label htmlFor={fieldId('service')}>Service destinataire *
          <select id={fieldId('service')} name="service" value={values.service} onChange={event => update('service', event.target.value)} required {...errorProps('service')}>{services.map(service => <option key={service}>{service}</option>)}</select>
          {fieldError('service')}
        </label>
        <label htmlFor={fieldId('assignee')}>Agent responsable fictif *
          <select id={fieldId('assignee')} name="assignee" value={values.assignee} onChange={event => update('assignee', event.target.value)} required {...errorProps('assignee')}>{assignees.map(assignee => <option key={assignee}>{assignee}</option>)}</select>
          {fieldError('assignee')}
        </label>
      </div>
      <div className="form-grid">
        <label htmlFor={fieldId('date')}>{values.kind === 'entrant' ? 'Date de réception' : 'Date d’enregistrement'} *
          <input type="date" id={fieldId('date')} name="date" value={values.date} onChange={event => changeDate(event.target.value)} min="2000-01-01" max={today()} required {...errorProps('date')} />
          {fieldError('date')}
        </label>
        <label htmlFor={fieldId('dueDate')}>Échéance de traitement *
          <input type="date" id={fieldId('dueDate')} name="dueDate" value={values.dueDate} onChange={event => { deadlineEdited.current = true; update('dueDate', event.target.value); }} min={isValidDate(values.date) ? values.date : '2000-01-01'} max="2099-12-31" required {...errorProps('dueDate')} />
          {fieldError('dueDate')}
        </label>
      </div>
      <div className="form-grid">
        <label htmlFor={fieldId('priority')}>Priorité *
          <select id={fieldId('priority')} name="priority" value={values.priority} onChange={event => update('priority', event.target.value as MailInput['priority'])} required {...errorProps('priority')}>{priorities.map(priority => <option key={priority}>{priority}</option>)}</select>
          {fieldError('priority')}
        </label>
        <label>Classification
          <input value="Démonstration" readOnly aria-label="Classification : Démonstration" />
        </label>
      </div>
      <label htmlFor={fieldId('notes')}>Observations
        <textarea id={fieldId('notes')} name="notes" value={values.notes} onChange={event => update('notes', event.target.value)} maxLength={1500} rows={3} placeholder="Contexte et instructions de démonstration…" {...errorProps('notes')} />
        {fieldError('notes')}
      </label>
      <div className="form-actions"><button type="button" className="secondary" onClick={onClose} disabled={isSaving}>Annuler</button><button type="submit" className="primary" disabled={isSaving} aria-busy={isSaving}>{isSaving ? <LoaderCircle size={17} className="button-spinner" aria-hidden="true" /> : <Check size={17} aria-hidden="true" />}{isSaving ? 'Enregistrement…' : 'Enregistrer le courrier'}</button></div>
    </form>
  </Modal>;
}

