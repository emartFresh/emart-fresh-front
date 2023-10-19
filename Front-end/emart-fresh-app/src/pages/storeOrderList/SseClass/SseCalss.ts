export class EventSourceSse {
  private eventSource: EventSource;

  constructor(url: string) {
    this.eventSource = new EventSource(url);
  }

  getMessage() {
    this.eventSource.onmessage = (event) => {
      return JSON.parse(event.data);
    };
  }

  setClonse() {
    this.eventSource.close();
  }
}
