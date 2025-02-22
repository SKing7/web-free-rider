import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectZoom(props: { zoom: number, onChangeZoom: (zoom: number) => void})  {
  const { zoom, onChangeZoom } = props;
  const handleChangeZoom = (value: string) => {
    console.log(value);
    onChangeZoom(Number(value));
  };

  return (
    <Select defaultValue={String(zoom)} onValueChange={handleChangeZoom}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="zoom" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="13">13</SelectItem>
          <SelectItem value="14">14</SelectItem>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="16">16</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}