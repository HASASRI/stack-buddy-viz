import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type RepresentationType = "array" | "linkedlist";

const StackVisualizer = () => {
  const [stack, setStack] = useState<number[]>([15, 25, 30, 50]);
  const [inputValue, setInputValue] = useState("");
  const [representationType, setRepresentationType] = useState<RepresentationType>("array");
  const [peekMessage, setPeekMessage] = useState<string | null>(null);

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setStack([...stack, value]);
    setInputValue("");
    setPeekMessage(null);
    toast.success(`Pushed ${value} to stack`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setPeekMessage(null);
    toast.success(`Popped ${poppedValue} from stack`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      toast.error("Stack is empty!");
      setPeekMessage(null);
      return;
    }
    const topValue = stack[stack.length - 1];
    setPeekMessage(`Top element is ${topValue}`);
  };

  const handleReset = () => {
    setStack([]);
    setInputValue("");
    setPeekMessage(null);
    toast.success("Stack reset successfully");
  };

  const topElement = stack.length > 0 ? stack[stack.length - 1] : "-";
  const stackSize = stack.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-header py-6 shadow-sm">
        <h1 className="text-center text-4xl font-bold text-header-foreground">
          Stack Visualizer
        </h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-center">
          <div className="w-64">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Representation Type
            </label>
            <Select value={representationType} onValueChange={(value: RepresentationType) => setRepresentationType(value)}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="linkedlist">Linked List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stack Visualization */}
          <div className="flex flex-col items-center">
            <div className="relative flex min-h-[400px] w-full max-w-md flex-col-reverse items-center justify-start rounded-xl border-4 border-foreground bg-card p-8 shadow-lg">
              {stack.length === 0 ? (
                <p className="text-muted-foreground">Stack is empty</p>
              ) : (
                <div className="flex w-full flex-col-reverse gap-2">
                  {stack.map((value, index) => (
                    <div
                      key={index}
                      className="flex h-16 items-center justify-center rounded-lg bg-success text-2xl font-bold text-success-foreground shadow-md transition-all duration-300"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-4 text-xl font-semibold text-foreground">Stack</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-md">
                <span className="text-lg font-medium text-foreground">Top of the Stack :-</span>
                <div className="flex h-12 w-24 items-center justify-center rounded-lg bg-success text-xl font-bold text-success-foreground">
                  {topElement}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-md">
                <span className="text-lg font-medium text-foreground">Size of the Stack :-</span>
                <div className="flex h-12 w-24 items-center justify-center rounded-lg bg-success text-xl font-bold text-success-foreground">
                  {stackSize}
                </div>
              </div>

              <Button
                onClick={handleReset}
                className="w-full bg-destructive py-6 text-lg font-semibold text-destructive-foreground hover:bg-destructive/90"
              >
                Reset
              </Button>

              {peekMessage && (
                <div className="rounded-lg bg-warning-light p-4 text-center shadow-md">
                  <p className="text-lg font-medium text-warning-foreground">{peekMessage}</p>
                </div>
              )}
            </div>

            {/* Input and Actions */}
            <div className="w-full max-w-md space-y-4">
              <Input
                type="text"
                placeholder="Enter element"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePush()}
                className="h-14 text-lg"
              />

              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={handlePush}
                  className="bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Push
                </Button>
                <Button
                  onClick={handlePop}
                  className="bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Pop
                </Button>
                <Button
                  onClick={handlePeek}
                  className="bg-primary py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Peek
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;
