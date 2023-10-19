import { useEffect, useRef } from "react";
import styles from "../../page_css/SearchingSelection.module.css";

interface ProductFilterData {
  searchingTerm?: string;
  eventNumber?: number;
  select?: number;
}

interface ChildProps {
  setFilteredData: React.Dispatch<React.SetStateAction<ProductFilterData>>;
  filterData: ProductFilterData;
  productDatas: ProductData[];
}

export default function SearchingSelection({
  setFilteredData,
  filterData,
  productDatas,
}: ChildProps) {
  const btnOne = useRef<HTMLButtonElement>(null);
  const btnTwo = useRef<HTMLButtonElement>(null);
  const btnThree = useRef<HTMLButtonElement>(null);
  const btnFour = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (filterData.eventNumber != undefined)
      setSelectionColor(filterData.eventNumber);
  }, [productDatas]);

  const setSelectionColor = (selectedCase: number) => {
    switch (selectedCase) {
      case 0:
        btnOne.current?.classList.add(styles.selectedColor);
        btnTwo.current?.classList.remove(styles.selectedColor);
        btnThree.current?.classList.remove(styles.selectedColor);
        btnFour.current?.classList.remove(styles.selectedColor);
        break;
      case 1:
        btnOne.current?.classList.remove(styles.selectedColor);
        btnTwo.current?.classList.add(styles.selectedColor);
        btnThree.current?.classList.remove(styles.selectedColor);
        btnFour.current?.classList.remove(styles.selectedColor);
        break;
      case 2:
        btnOne.current?.classList.remove(styles.selectedColor);
        btnTwo.current?.classList.remove(styles.selectedColor);
        btnThree.current?.classList.add(styles.selectedColor);
        btnFour.current?.classList.remove(styles.selectedColor);
        break;
      case 3:
        btnOne.current?.classList.remove(styles.selectedColor);
        btnTwo.current?.classList.remove(styles.selectedColor);
        btnThree.current?.classList.remove(styles.selectedColor);
        btnFour.current?.classList.add(styles.selectedColor);
        break;
    }
  };

  const setSelectionBorder = (selectedCase: number) => {
    console.log("선택 케이스", selectedCase);
    switch (selectedCase) {
      case 0:
        console.log("적용");
        btnOne.current?.classList.add(styles.selectedBorder);
        btnTwo.current?.classList.remove(styles.selectedBorder);
        btnThree.current?.classList.remove(styles.selectedBorder);
        btnFour.current?.classList.remove(styles.selectedBorder);
        break;
      case 1:
        btnOne.current?.classList.remove(styles.selectedBorder);
        btnTwo.current?.classList.add(styles.selectedBorder);
        btnThree.current?.classList.remove(styles.selectedBorder);
        btnFour.current?.classList.remove(styles.selectedBorder);
        break;
      case 2:
        btnOne.current?.classList.remove(styles.selectedBorder);
        btnTwo.current?.classList.remove(styles.selectedBorder);
        btnThree.current?.classList.add(styles.selectedBorder);
        btnFour.current?.classList.remove(styles.selectedBorder);
        break;
      case 3:
        btnOne.current?.classList.remove(styles.selectedBorder);
        btnTwo.current?.classList.remove(styles.selectedBorder);
        btnThree.current?.classList.remove(styles.selectedBorder);
        btnFour.current?.classList.add(styles.selectedBorder);
        break;
    }
  };

  const handleSearchSelectChange = (e) => {
    const searchigData: ProductFilterData = {
      ...filterData,
      [e.target.name]: e.target.value,
    };

    setFilteredData(searchigData);
  };

  const handleEventBtnClick = (e, evtVal: number) => {
    const searchigData: ProductFilterData = {
      ...filterData,
      [e.target.name]: evtVal,
    };
    setFilteredData(searchigData);
    setSelectionBorder(evtVal);
  };

  console.log("셀렉션");

  return (
    <section className={styles.selectionSection}>
      <div className={styles.eventContainer}>
        <button
          ref={btnOne}
          name="eventNumber"
          className={styles.eventSelection}
          onClick={(e) => {
            handleEventBtnClick(e, 0);
          }}
        >
          전체{" "}
        </button>
        <button
          ref={btnTwo}
          name="eventNumber"
          className={styles.eventSelection}
          onClick={(e) => {
            handleEventBtnClick(e, 1);
          }}
        >
          1 + 1{" "}
        </button>
        <button
          ref={btnThree}
          name="eventNumber"
          className={styles.eventSelection}
          onClick={(e) => {
            handleEventBtnClick(e, 2);
          }}
        >
          2 + 1
        </button>
        <button
          ref={btnFour}
          name="eventNumber"
          className={styles.eventSelection}
          onClick={(e) => {
            handleEventBtnClick(e, 3);
          }}
        >
          2 + 2
        </button>
      </div>
      <div>
        <select
          onClick={handleSearchSelectChange}
          className={styles.eventSelectTag}
          name="select"
          id=""
        >
          <option value="0">최신순</option>
          <option value="1">가격 낮은 순</option>
          <option value="2">가격 높은 순</option>
          <option value="3">주문 많은 순</option>
        </select>
      </div>
    </section>
  );
}
