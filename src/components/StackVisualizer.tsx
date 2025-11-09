import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type RepresentationType = "stack" | "array" | "linkedlist";

const StackVisualizer = () => {
  const [stack, setStack] = useState<number[]>([15, 25, 30, 50]);
  const [inputValue, setInputValue] = useState("");
  const [representationType, setRepresentationType] = useState<RepresentationType>("stack");
  const [peekMessage, setPeekMessage] = useState<string | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<"push" | "pop" | null>(null);

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setOperation("push");
    setAnimatingIndex(0);
    setTimeout(() => {
      setStack([...stack, value]);
      setInputValue("");
      setPeekMessage(null);
      toast.success(`Pushed ${value} to stack`);
      setTimeout(() => {
        setOperation(null);
        setAnimatingIndex(null);
      }, 300);
    }, 50);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    const poppedValue = stack[stack.length - 1];
    setOperation("pop");
    setAnimatingIndex(0);
    setTimeout(() => {
      setStack(stack.slice(0, -1));
      setPeekMessage(null);
      toast.success(`Popped ${poppedValue} from stack`);
      setTimeout(() => {
        setOperation(null);
        setAnimatingIndex(null);
      }, 300);
    }, 400);
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
                <SelectItem value="stack">Stack</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="linkedlist">Linked List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stack Visualization */}
          <div className="flex flex-col items-center">
            <div className="relative flex min-h-[400px] w-full max-w-3xl flex-col items-center justify-center rounded-xl border-4 border-foreground bg-card p-8 shadow-lg">
              {stack.length === 0 ? (
                <p className="text-muted-foreground">Stack is empty</p>
              ) : representationType === "stack" ? (
                // Vertical Stack Representation (Green Boxes)
                <div className="flex w-full max-w-md flex-col-reverse gap-2">
                  {stack.map((value, index) => {
                    const isTopElement = index === stack.length - 1;
                    const isAnimating = operation === "pop" && isTopElement;
                    
                    return (
                      <div
                        key={`${value}-${index}`}
                        className={`flex h-16 items-center justify-center rounded-lg bg-success text-2xl font-bold text-success-foreground shadow-md transition-all duration-500 ${
                          isAnimating ? "opacity-0 translate-y-8 scale-75" : "opacity-100 translate-y-0 scale-100"
                        } ${
                          operation === "push" && isTopElement ? "animate-[slideInTop_0.5s_ease-out]" : ""
                        }`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ) : representationType === "array" ? (
                // Array Representation
                <div className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-foreground">top</span>
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border-4 border-foreground bg-card text-2xl font-bold text-foreground">
                      {stack.length > 0 ? stack.length - 1 : "-"}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-0">
                      {stack.map((value, index) => (
                        <div
                          key={index}
                          className="flex h-20 w-20 items-center justify-center border-2 border-foreground bg-card text-xl font-bold text-foreground"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-0">
                      {stack.map((value, index) => (
                        <div
                          key={index}
                          className="flex h-12 w-20 items-center justify-center text-lg font-semibold text-primary"
                        >
                          {index}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Linked List Representation
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="flex items-center gap-2 self-start ml-8">
                    <span className="text-lg font-semibold text-foreground">Top</span>
                    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
                      <path d="M8 8 L35 35 M35 35 L27 32 M35 35 L32 27" stroke="currentColor" strokeWidth="2.5" className="text-foreground"/>
                    </svg>
                  </div>
                  
                  <div className="flex items-center gap-1 overflow-x-auto pb-4">
                    {stack.slice().reverse().map((value, index) => {
                      const isTopElement = index === 0;
                      const isAnimating = operation === "pop" && isTopElement;
                      
                      return (
                        <div 
                          key={`${value}-${index}`} 
                          className={`flex items-center transition-all duration-500 ${
                            isAnimating ? "opacity-0 -translate-y-8 scale-75" : "opacity-100 translate-y-0 scale-100"
                          } ${
                            operation === "push" && isTopElement ? "animate-[slideInRight_0.5s_ease-out]" : ""
                          }`}
                          style={{
                            animation: operation === "push" && isTopElement ? "slideInRight 0.5s ease-out" : "none"
                          }}
                        >
                          {/* Node with data and pointer sections */}
                          <div className={`flex border-4 bg-card transition-all duration-300 ${
                            isTopElement && !isAnimating ? "border-primary shadow-lg shadow-primary/50" : "border-foreground"
                          }`}>
                            {/* Data section */}
                            <div className="flex h-20 w-24 items-center justify-center border-r-4 border-inherit">
                              <span className={`text-2xl font-bold transition-colors duration-300 ${
                                isTopElement && !isAnimating ? "text-primary" : "text-foreground"
                              }`}>{value}</span>
                            </div>
                            {/* Pointer section */}
                            <div className="relative flex h-20 w-12 items-center justify-center">
                              {index < stack.length - 1 ? (
                                <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
                                  <path 
                                    d="M4 16 L28 16 M28 16 L20 8 M28 16 L20 24" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                    className={`transition-colors duration-300 ${
                                      isTopElement && !isAnimating ? "text-primary" : "text-foreground"
                                    }`}
                                  />
                                </svg>
                              ) : (
                                // NULL indicator - diagonal line
                                <svg className="h-full w-full" viewBox="0 0 48 80" fill="none">
                                  <path 
                                    d="M5 5 L43 75" 
                                    stroke="currentColor" 
                                    strokeWidth="3" 
                                    className={`transition-colors duration-300 ${
                                      isTopElement && !isAnimating ? "text-primary" : "text-foreground"
                                    }`}
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          
                          {/* Arrow between nodes */}
                          {index < stack.length - 1 && (
                            <svg className="h-8 w-8 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                              <path 
                                d="M4 16 L28 16 M28 16 L20 8 M28 16 L20 24" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                className={`transition-colors duration-300 ${
                                  isTopElement && !isAnimating ? "text-primary" : "text-foreground"
                                }`}
                                style={{
                                  animation: operation === "push" && isTopElement ? "dash 0.5s ease-in-out 0.3s" : "none",
                                  strokeDasharray: "40",
                                  strokeDashoffset: "0"
                                }}
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
