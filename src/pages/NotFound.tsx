import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SEO
        title="Страница не найдена — OilMate"
        description="Запрашиваемая страница не существует. Вернитесь на главную страницу OilMate."
      />
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Страница не найдена</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 rounded-full gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
