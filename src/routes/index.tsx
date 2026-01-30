import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import db from '@/db';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ListTodoIcon, PlusIcon } from 'lucide-react';

const serverLoader = createServerFn({ method: 'GET' }).handler(() => {
  return db.query.todos.findMany();
});

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    return serverLoader();
  },
});

function App() {
  const todos = Route.useLoaderData();
  const completedCount = todos.filter((todo) => todo.isComplete).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen container space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Todo List</h1>
          {totalCount > 0 && (
            <Badge variant="outline">
              {completedCount} of {totalCount} completed
            </Badge>
          )}
        </div>
        <div>
          <Button size="sm" asChild>
            <Link to="/todos/new">
              <PlusIcon /> Add Todo
            </Link>
          </Button>
        </div>
      </div>
      <TodoListTable todos={todos} />
    </div>
  );
}

interface TodoListTableProps {
  id: string;
  name: string;
  isComplete: boolean;
  createdAt: Date;
}

const TodoListTable = ({ todos }: { todos: Array<TodoListTableProps> }) => {
  if (todos.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodoIcon />
          </EmptyMedia>
          <EmptyTitle>No Todos</EmptyTitle>
          <EmptyDescription>Try adding a new todo</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/todos/new">
              <PlusIcon /> Add Todo
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
};
