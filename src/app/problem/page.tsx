import { Header } from "../components/Header";
import { Problems } from "../components/Problems";

const Page = () => {
  return (
    <>
      <Header />
      <div className="mt-24 px-10">
        <Problems />
      </div>
    </>
  );
};

export default Page;
