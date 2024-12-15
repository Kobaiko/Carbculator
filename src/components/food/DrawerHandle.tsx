interface DrawerHandleProps {
  onClose: () => void;
}

export function DrawerHandle({ onClose }: DrawerHandleProps) {
  return (
    <div 
      className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 my-4 cursor-pointer" 
      onClick={onClose}
    />
  );
}