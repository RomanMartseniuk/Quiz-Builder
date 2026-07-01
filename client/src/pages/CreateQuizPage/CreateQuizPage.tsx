import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Field, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question } from "@/types/Question";
import { PencilIcon, XIcon } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuizzes } from "@/hooks/useQuizzes";

const QuestionEdit = ({
  selectedType,
  initialQuestion,
  onSave,
  onCancel,
}: {
  selectedType: "boolean" | "input" | "checkbox";
  initialQuestion?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}) => {
  const [questionText, setQuestionText] = useState(
    initialQuestion?.question ?? "",
  );

  // boolean
  const [boolAnswer, setBoolAnswer] = useState<boolean | undefined>(
    initialQuestion?.type === "boolean" ? initialQuestion.answer : undefined,
  );

  // input
  const [inputAnswer, setInputAnswer] = useState(
    initialQuestion?.type === "input" ? initialQuestion.answer : "",
  );

  // checkbox
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.type === "checkbox" ? initialQuestion.options : ["", ""],
  );
  const [checkedOptions, setCheckedOptions] = useState<string[]>(
    initialQuestion?.type === "checkbox" ? initialQuestion.answer : [],
  );

  const handleSave = () => {
    if (!questionText.trim()) return;

    if (selectedType === "boolean") {
      if (boolAnswer === undefined) return;
      onSave({
        id: initialQuestion?.id,
        type: "boolean",
        question: questionText,
        answer: boolAnswer,
      });
    } else if (selectedType === "input") {
      if (!inputAnswer.trim()) return;
      onSave({
        id: initialQuestion?.id,
        type: "input",
        question: questionText,
        answer: inputAnswer,
      });
    } else if (selectedType === "checkbox") {
      const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
      const validAnswers = checkedOptions.filter((a) =>
        cleanOptions.includes(a),
      );
      if (cleanOptions.length < 2 || validAnswers.length === 0) return;
      onSave({
        id: initialQuestion?.id,
        type: "checkbox",
        question: questionText,
        options: cleanOptions,
        answer: validAnswers,
      });
    }
  };

  return (
    <form className="flex flex-col gap-4 items-center">
      <h2>{initialQuestion ? "Edit Question" : "Add Question"}</h2>
      <div className="flex flex-col gap-2">
        <Field>
          <FieldTitle>Question</FieldTitle>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here..."
          />
        </Field>

        {selectedType === "boolean" && (
          <BooleanQuestionEdit value={boolAnswer} onChange={setBoolAnswer} />
        )}
        {selectedType === "input" && (
          <InputQuestionEdit value={inputAnswer} onChange={setInputAnswer} />
        )}
        {selectedType === "checkbox" && (
          <CheckboxQuestionEdit
            options={options}
            setOptions={setOptions}
            checkedOptions={checkedOptions}
            setCheckedOptions={setCheckedOptions}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button type="button" variant="default" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const BooleanQuestionEdit = ({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Field>
      <FieldTitle>Answer</FieldTitle>
      <Select
        value={value === undefined ? undefined : String(value)}
        onValueChange={(v) => onChange(v === "true")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose Answer" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Answers</SelectLabel>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

const InputQuestionEdit = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Field>
      <FieldTitle>Answer</FieldTitle>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter the answer here..."
      />
    </Field>
  );
};

const CheckboxQuestionEdit = ({
  options,
  setOptions,
  checkedOptions,
  setCheckedOptions,
}: {
  options: string[];
  setOptions: (options: string[]) => void;
  checkedOptions: string[];
  setCheckedOptions: (options: string[]) => void;
}) => {
  const updateOption = (index: number, value: string) => {
    const oldValue = options[index];
    const next = [...options];
    next[index] = value;
    setOptions(next);

    // если переименовали вариант, который уже был отмечен как правильный —
    // обновляем и в checkedOptions
    if (checkedOptions.includes(oldValue)) {
      setCheckedOptions(
        checkedOptions.map((o) => (o === oldValue ? value : o)),
      );
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    const value = options[index];
    setOptions(options.filter((_, i) => i !== index));
    setCheckedOptions(checkedOptions.filter((o) => o !== value));
  };

  const toggleAnswer = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter((o) => o !== value));
    }
  };

  return (
    <Field>
      <FieldTitle>Options & Answer</FieldTitle>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox
              checked={
                option.trim().length > 0 && checkedOptions.includes(option)
              }
              disabled={option.trim().length === 0}
              onCheckedChange={(checked) =>
                toggleAnswer(option, checked === true)
              }
            />
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addOption}>
          Add option
        </Button>
      </div>
    </Field>
  );
};

const AddQuestionAlert = ({
  onValueChange,
  selectedType,
  setIsEditorOpen,
}: {
  onValueChange: (value: "boolean" | "checkbox" | "input" | null) => void;
  selectedType: "boolean" | "checkbox" | "input" | null;
  setIsEditorOpen: (value: boolean) => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">Add Question</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add the question to your Quiz</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2 items-center mb-10">
            Choose the type of question you want to add and fill in the required
            details.
            <Select
              onValueChange={(value) =>
                onValueChange(value as "boolean" | "checkbox" | "input")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type of the question" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            onClick={() => {
              if (!selectedType) return;
              setIsEditorOpen(true);
            }}
          >
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// ...остальные импорты как были

export const CreateQuizPage = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedType, setSelectedType] = useState<
    "boolean" | "input" | "checkbox" | null
  >(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { createQuiz } = useQuizzes();
  const navigate = useNavigate();

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, { ...question, id: crypto.randomUUID() }]);
    setIsEditorOpen(false);
    setSelectedType(null);
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setSelectedType(null);
    setEditingId(null);
  };

  const handleRemoveQuestion = (id: string | undefined) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleStartEdit = (id: string | undefined) => {
    if (!id) return;
    setEditingId(id);
    setIsEditorOpen(false);
  };

  const handleUpdateQuestion = (question: Question) => {
    setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
    setEditingId(null);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      setSaveError("Enter a quiz title");
      return;
    }
    if (questions.length === 0) {
      setSaveError("Add at least one question");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await createQuiz(quizTitle, questions);
      navigate(`/`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSaveError("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 max-w-150 m-auto">
        <h1 className="text-center text-3xl font-bold">Create your Quiz</h1>
        <Field>
          <FieldTitle>Quiz Title</FieldTitle>
          <Input
            className="h-10 text-[18px]!"
            placeholder="Enter title of your quiz here..."
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </Field>

        <div className="flex flex-col items-center gap-2 rounded border border-gray-300 p-4">
          {questions.length === 0 && !isEditorOpen && (
            <div className="text-muted-foreground">No Question Here Yet.</div>
          )}

          {/* Questions list */}
          {questions.map((q) =>
            editingId === q.id ? (
              <QuestionEdit
                key={q.id}
                selectedType={q.type}
                initialQuestion={q}
                onSave={handleUpdateQuestion}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div
                key={q.id}
                className="flex items-center justify-between w-full border rounded p-2"
              >
                <div>
                  <div>
                    <span className="font-medium">{q.question}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                      ({q.type})
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {q.type === "boolean" && (
                      <span>Answer: {q.answer ? "True" : "False"}</span>
                    )}
                    {q.type === "input" && <span>Answer: {q.answer}</span>}
                    {q.type === "checkbox" && (
                      <span>Answer: {q.answer.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartEdit(q.id)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(q.id)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ),
          )}
          {isEditorOpen && selectedType && (
            <QuestionEdit
              selectedType={selectedType}
              onSave={handleAddQuestion}
              onCancel={handleCancelEdit}
            />
          )}

          <AddQuestionAlert
            onValueChange={setSelectedType}
            selectedType={selectedType}
            setIsEditorOpen={setIsEditorOpen}
          />
        </div>

        {saveError && (
          <div className="text-red-500 text-sm text-center">{saveError}</div>
        )}

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button onClick={handleSaveQuiz} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Quiz"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
};
