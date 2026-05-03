export interface Question { 
    id: number; 
    question: string; 
    optionA: string; 
    optionB: string; 
    optionC: string; 
    correct: string; 
}

export type ShuffledQuestion = {
    id: number,
    question: string,
    options: string[],
    correct: string
    }