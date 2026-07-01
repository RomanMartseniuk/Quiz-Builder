export type Question =
   | {
      id?: string;
      type: 'boolean';
      question: string;
      answer: boolean;
   }
   | {
      id?: string;
      type: 'input';
      question: string;
      answer: string;
   }
   | {
      id?: string;
      type: 'checkbox';
      question: string;
      options: string[];
      answer: string[];
   };