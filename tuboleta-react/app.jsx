const { useState } = React;

function TicketBooth() {
  const [tickets, setTickets] = useState([]);
  const [name, setName] = useState('');

  function buy() {
    if (!name.trim()) return;
    const t = { id: Date.now(), name: name.trim(), time: new Date().toLocaleTimeString() };
    setTickets([t, ...tickets]);
    setName('');
  }

  return (
    <div className="tv-container">
      <h1>Tuboleta</h1>
      <div className="tv-form">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre comprador" />
        <button onClick={buy}>Comprar Ticket</button>
      </div>

      <ul className="tv-list">
        {tickets.length === 0 ? (
          <li className="tv-empty">No hay tickets vendidos</li>
        ) : (
          tickets.map(t => (
            <li key={t.id} className="tv-item"><strong>{t.name}</strong> <span className="tv-time">{t.time}</span></li>
          ))
        )}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TicketBooth />);
