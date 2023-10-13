function EventBadge(props: { text: string; className: string }) {
  return <div className={props.className}>{props.text}</div>;
}

export default EventBadge;
