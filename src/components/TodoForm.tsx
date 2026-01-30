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
import { eq } from 'drizzle-orm';

const addTodo = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z
        .string()
        .min(1, { message: 'You must enter at least one character' }),
    }),
  )
  .handler(async ({ data }) => {
    await db.insert(todos).values({ ...data, isComplete: false });
    throw redirect({ to: '/' });
  });

const updateTodo = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      name: z
        .string()
        .min(1, { message: 'You must enter at least one character' }),
    }),
  )
  .handler(async ({ data }) => {
    await db.update(todos).set(data).where(eq(todos.id, data.id));
    throw redirect({ to: '/' });
  });

const TodoForm = ({
  todo,
}: {
  todo?: {
    name: string;
    id: string;
  };
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addTodoFn = useServerFn(addTodo);
  const updateTodoFn = useServerFn(updateTodo);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const name = nameRef.current?.value;

    if (!name) return;

    setIsLoading(true);

    if (todo == null) {
      await addTodoFn({ data: { name } });
    } else {
      await updateTodoFn({ data: { name, id: todo.id } });
    }

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
        defaultValue={todo?.name}
      />
      <Button type="submit" disabled={isLoading}>
        <LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
          {todo == null ? (
            <>
              <PlusIcon /> Add
            </>
          ) : (
            'Update'
          )}
        </LoadingSwap>
      </Button>
    </form>
  );
};

export default TodoForm;
