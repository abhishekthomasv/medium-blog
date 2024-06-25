import { DNA } from "react-loader-spinner"

const DNASpiral = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="">
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </div>
    </div>
  )
}

export default DNASpiral
