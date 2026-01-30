import db from '@/db';
import { todos } from '@/db/schema';
import { redirect } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { PlusIcon } from 'lucide-react';
import { SubmitEvent, useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LoadingSwap } from './ui/loading-swap';

const addTodo = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await db.insert(todos).values({ ...data, isComplete: false });
    throw redirect({ to: '/' });
  });

const TodoForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addTodoFn = useServerFn(addTodo);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const name = nameRef.current?.value;
    if (!name) return;
    setIsLoading(true);
    await addTodoFn({ data: { name } });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        id="addTodo"
        autoFocus
        ref={nameRef}
        placeholder="Enter your todo..."
        className="flex-1"
        aria-label="Name"
        required
      />
      <Button type="submit" disabled={isLoading}>
        <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
          <PlusIcon /> Add
        </LoadingSwap>
      </Button>
    </form>
  );
};

export default TodoForm;
