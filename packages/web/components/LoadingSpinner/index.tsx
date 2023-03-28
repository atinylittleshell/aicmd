type Props = {
  text?: string;
};

export const LoadingSpinner = (props: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {props.text && <div className="text-center opacity-50">{props.text}</div>}
      <progress className="progress" />
    </div>
  );
};
