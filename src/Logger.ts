export interface Logger {
  log(message: string): void;
}

// ConsoleLogger is used for the interactive one fight mode
export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

// SilentLogger keeps the simulation loop from spamming output
export class SilentLogger implements Logger {
  log(message: string): void {
    void message;
  }
}
