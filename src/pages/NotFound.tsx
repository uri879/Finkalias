import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404: המשתמש ניסה לגשת לנתיב שלא קיים:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">אופס! העמוד לא נמצא</p>
        <Button asChild variant="link">
          <a href="/">חזרה לדף הבית</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
