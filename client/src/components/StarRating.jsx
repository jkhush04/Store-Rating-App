export default function StarRating({ value, onChange }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          className={star <= value ? 'star filled' : 'star'}
          title={`Rate ${star}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}