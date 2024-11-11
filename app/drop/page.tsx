"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialTasks = [
    {
        _id: "1",
        title: "Task One",
        description: "Description for task one",
        status: "To Do",
        priority: "High",
        dueDate: new Date(),
    },
    {
        _id: "2",
        title: "Task Two",
        description: "Description for task two",
        status: "In Progress",
        priority: "Medium",
        dueDate: new Date(),
    },
    {
        _id: "3",
        title: "Task Three",
        description: "Description for task three",
        status: "Completed",
        priority: "Low",
        dueDate: new Date(),
    },
];

const Kanban = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const draggedItemId = result.draggableId;
        const sourceColumn = result.source.droppableId;
        const destinationColumn = result.destination.droppableId;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        console.log('id', draggedItemId)
        console.log('sourceColumn', sourceColumn)
       console.log('destinationColumn', destinationColumn)
       console.log('sourceIndex', sourceIndex)
       console.log('destinationIndex', destinationIndex)



        if (sourceColumn === destinationColumn) {
            const newTasks = Array.from(tasks);
            const [movedTask] = newTasks.splice(sourceIndex, 1);

            newTasks.splice(destinationIndex, 0, movedTask);
            setTasks(newTasks);
            console.log('newTasks', newTasks)
            console.log('movedTask', movedTask)

        } else {
            const taskIndex = tasks.findIndex((task) => task._id === draggedItemId);
            const updatedTask = { ...tasks[taskIndex], status: destinationColumn };

            const newTasks = [
                ...tasks.slice(0, taskIndex),
                updatedTask,
                ...tasks.slice(taskIndex + 1),
            ];
            setTasks(newTasks);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 justify-evenly max-lg:flex-wrap">
                {["To Do", "In Progress", "Completed"].map((status) => (
                    <div key={status} className="dark:bg-secondary bg-gray-200 p-4 rounded-lg w-full">
                        <h3 className="font-semibold mb-4">{status}</h3>
                        <Droppable droppableId={status}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-2 min-h-[100px]"
                                >
                                    {tasks
                                        .filter((task) => task.status === status)
                                        .sort((a, b) => a.title.localeCompare(b.title))
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-background p-4 rounded shadow flex justify-between"
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <p className={"bg-primary"}>{task.priority}</p>
                                                            <div className="capitalize">
                                                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                                                {task.description && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 my-1">
                                                                        {task.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {task.dueDate && (
                                                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                                        <Calendar className="h-4 w-4 mr-1" />
                                                                        {format(task.dueDate, "MMM d, yyyy")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                     
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default Kanban;
