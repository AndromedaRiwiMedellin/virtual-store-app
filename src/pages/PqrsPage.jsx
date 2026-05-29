import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPqrs, getMyPqrs } from '../services/pqrsApi.js';
import { formatDate } from '../utils/formatters.js';

const initialForm = {
  type: 'Petition',
  subject: '',
  message: ''
};

const statusLabels = {
  OPEN: 'Open',
  ANSWERED: 'Answered',
  CLOSED: 'Closed',
  IN_REVIEW: 'In review'
};

function getStatusLabel(status) {
  return statusLabels[String(status ?? '').toUpperCase()] ?? status ?? 'Open';
}

export default function PqrsPage({ user }) {
  const [form, setForm] = useState(initialForm);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const loadRequests = () => {
    setIsLoading(true);
    getMyPqrs(user)
      .then(setRequests)
      .catch(() => {
        setStatus({
          type: 'error',
          message: 'We could not load your requests right now.'
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.subject.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Complete the subject and message to submit your request.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await createPqrs(user, form);
      setForm(initialForm);
      setStatus({ type: 'success', message: 'Request submitted. You can check the status from this same section.' });
      loadRequests();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'We could not submit the request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="section-heading compact">
        <div>
          <span>Support</span>
          <h1>PQRS status and responses</h1>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Request type
          <select value={form.type} onChange={(event) => handleChange('type', event.target.value)}>
            <option>Petition</option>
            <option>Complaint</option>
            <option>Claim</option>
            <option>Suggestion</option>
          </select>
        </label>
        <label>
          Subject
          <input
            value={form.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            placeholder="Example: Problem with my order"
          />
        </label>
        <label className="full">
          Message
          <textarea
            rows="6"
            value={form.message}
            onChange={(event) => handleChange('message', event.target.value)}
            placeholder="Describe your request"
          />
        </label>
        {status.message && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          <Send size={18} />
          {isSubmitting ? 'Submitting...' : 'Submit request'}
        </button>
      </form>

      <div className="status-panel">
        <strong>My requests</strong>
        {isLoading ? (
          <p>Loading recent requests.</p>
        ) : requests.length === 0 ? (
          <p>You do not have registered requests yet.</p>
        ) : (
          <div className="pqrs-list">
            {requests.map((item) => (
              <article key={item.id} className="pqrs-item">
                <div>
                  <span>{item.type} - {getStatusLabel(item.status)}</span>
                  <strong>{item.subject}</strong>
                  <small>{formatDate(item.createdAt)}</small>
                </div>
                {item.responses?.length > 0 ? (
                  <p>{item.responses[item.responses.length - 1].response}</p>
                ) : (
                  <p>Your request is under review by the support team.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
