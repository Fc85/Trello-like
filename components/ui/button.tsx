import * as React from "react";

type ButtonProps = React.ComponentProps<"button">;


export default function Button ({ className, ...props }: ButtonProps) {

  return <button type='button' {...props} className={`component-button ${className}`} />;

};
