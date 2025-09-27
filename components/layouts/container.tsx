type TContainerProps = {
  children: React.ReactNode;
};

export default function Container(props: TContainerProps) {
  const { children } = props;
  return <div className="px-4 mx-auto container max-w-5xl">{children}</div>;
}
