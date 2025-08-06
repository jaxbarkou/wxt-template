const FloatingButton = ({
  text,
  position,
}: {
  text: string;
  position: { x: number; y: number };
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: position.y + 10,
        left: position.x + 10,
        backgroundColor: "#3b82f6",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        zIndex: 9999,
        cursor: "pointer",
      }}
      onClick={() => {
        chrome.runtime.sendMessage({
          type: "SEND_SELECTED_TEXT",
          payload: text,
        });
      }}
    >
      查询选中项目
    </div>
  );
};

export default FloatingButton;
