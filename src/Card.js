const Card = ({ campaign, adset, creative, spend, impressions, clicks, results }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        margin: '12px',
        padding: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        maxWidth: '320px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h3 style={{ marginBottom: '8px', color: '#222' }}>{campaign}</h3>
      <p><strong>Adset:</strong> {adset}</p>
      <p><strong>Creative:</strong> {creative}</p>
      <p><strong>Spend:</strong> ${spend.toFixed(2)}</p>
      <p><strong>Impressions:</strong> {impressions.toLocaleString()}</p>
      <p><strong>Clicks:</strong> {clicks.toLocaleString()}</p>
      <p><strong>Results:</strong> {results.toLocaleString()}</p>
    </div>
  )
}

export default Card;