import { ChevronDownIcon } from "@/components/Icons/ChevronDownIcon/ChevronDownIcon";
import React, { useState } from "react";
import styles from "./Select.module.scss";
import { ISelectItem } from "./types/ISelectItem";

interface IProps {
  values: ISelectItem[];
  handleSelect: (item: ISelectItem) => void;
  selectedValue?: string;
  className?: string;
}

export const Select: React.FC<IProps> = ({
  values,
  handleSelect,
  selectedValue,
  className,
}) => {
  const [selectedItem, setSelectedItem] = useState<ISelectItem>(
    selectedValue
      ? values.find((value) => value.value === selectedValue) || values[0]
      : values[0] || { name: "Wählen", value: "" }
  );
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleChangeSelect = (item: ISelectItem) => {
    setSelectedItem(item);
    handleSelect(item);
    setOpen(false);
  };

  const toggleOpenSelect = () => setOpen(!isOpen);

  return (
    <>
      <div
        className={`${isOpen ? styles.backdrop : ""}`}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className={`${styles.container} ${className}`}>
        <div className={styles.select} onClick={toggleOpenSelect}>
          <span className={styles.name}>{selectedItem?.name}</span>
          <div className={`${styles.icon} ${isOpen ? styles.iconUp : ""}`}>
            <ChevronDownIcon />
          </div>
        </div>
        <div
          className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
        >
          {values &&
            values?.map((item) => (
              <div
                className={styles.item}
                onClick={() => handleChangeSelect(item)}
                key={item.name}
              >
                <span className={styles.name}>{item.name}</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
