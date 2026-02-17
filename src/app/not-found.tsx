import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary">
          404
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Страница не найдена
        </h2>
        <p className="max-w-[600px] text-muted-foreground mx-auto">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="gradient-primary">
          <Link href="/">
            Вернуться на главную
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/catalog">
            Перейти в каталог
          </Link>
        </Button>
      </div>
    </div>
  );
}
