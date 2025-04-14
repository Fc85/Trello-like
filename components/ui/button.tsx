import * as React from "react";

type ButtonProps = React.ComponentProps<"button">;


export default function Button ({ className, ...props }: ButtonProps) {

  return <button type='button' {...props} className={`bg-white border rounded-lg px-2 py-1 cursor-pointer border-black hover:bg-black hover:text-white ${className}`} />;

};
