"use client";

import { Todo } from "@/generated/prisma";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

function Dashboard() {
  const { user } = useUser();
  const [todo, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm] = useDebounceValue(searchTerm, 300);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchTodos = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/todos?page=${page}&search=${debounceSearchTerm}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await res.json();
        setTodos(data.todos);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
    [debounceSearchTerm]
  );

  useEffect(() => {
    fetchTodos(1);
    fetchSubscriptionStatus();
  }, [fetchTodos]);

  const fetchSubscriptionStatus = async () => {
    const res = await fetch("/api/subscription");
    if (res.ok) {
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Cotent-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        throw new Error("Failed to add todo");
      }
      await fetchTodos(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatetTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("/api/todos/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      await fetchTodos(currentPage);
    } catch (error) {}
  };

  const handleDeleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    await fetchTodos(currentPage);
  };

  return <div>Dashboard</div>;
}
