import { Toaster as Sonner } from "sonner";
import React from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group font-sans"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4",
                    description: "group-[.toast]:text-gray-500",
                    actionButton: "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
                    cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
                    error: "group-[.toaster]:text-red-600 group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50",
                    success: "group-[.toaster]:text-green-600 group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50",
                    warning: "group-[.toaster]:text-yellow-600 group-[.toaster]:border-yellow-200 group-[.toaster]:bg-yellow-50",
                    info: "group-[.toaster]:text-blue-600 group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
