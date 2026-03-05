import '../StyleComponents/Header.css';

export default function Header({
  presentationTitle,
  setPresentationTitle
}: {
  presentationTitle: string;
  setPresentationTitle: (value: string) => void;
}) {
  return (
    <div className="header">
      <div className="name">
        <h1 className="name">{presentationTitle}</h1>
      </div>
      <input
        type="text"
        value={presentationTitle}
        onChange={(e) => {
          setPresentationTitle(e.target.value);
          console.log("Новое название:", e.target.value);
        }}
        className="header-input" 
      />
    </div>
  );
}