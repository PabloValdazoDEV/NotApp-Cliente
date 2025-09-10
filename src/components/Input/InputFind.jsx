import { FaMagnifyingGlass } from "react-icons/fa6";
import ButtonGeneral from "../Buttons/ButtonGeneral";
import InputGeneral from "./InputGeneral";
import { VscClearAll } from "react-icons/vsc";

export default function InputForm({
  submitPrimary,
  submitSecondary,
  placeholder,
  id,
  className,
  ...rest
}) {
  return (
    <form
      onSubmit={submitPrimary}
      className={`${className ? className : "flex flex-row gap-3  w-full"}`}
    >
      <InputGeneral
        placeholder={placeholder}
        type="text"
        id={id}
        name={id}
        {...rest}
      />
      <ButtonGeneral
        onClick={submitSecondary}
        className="bg-amber-600 hover:bg-amber-700"
        children={<VscClearAll className="text-xl text-white" />}
      />
      <ButtonGeneral
        type="submit"
        children={<FaMagnifyingGlass className="text-xl text-white" />}
      />
    </form>
  );
}
