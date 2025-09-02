"use client";

export function SimpleTest() {
  console.log("🧪 [SimpleTest] Component rendered");
  
  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="text-lg font-bold">Simple Test Component</h3>
      <p>If you can see this, React is working.</p>
      <p>Check the browser console for the log message.</p>
    </div>
  );
}
