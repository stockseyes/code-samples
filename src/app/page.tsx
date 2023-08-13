import "./css/center.css"
import Link from "next/link";

export default function Home() {
  return (
      <div className="centered-div">
          <h1>StocksEyes Code Samples for Next js</h1>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/realTimeStockDataAppRouter">
                  <button style={styles.button}><h2>Real Time Price <br/> (App Router Example) <br/> check file "src/app/realTimeStockDataAppRouter/page.tsx" </h2></button>
              </Link>
              <Link href="/realTimeStockDataPageRouter">
                  <button style={styles.button}><h2>Real Time Price <br/> (Page Router Example) </h2></button>
              </Link>
          </div>
      </div>
  )
}

const styles = {
    button: {
        padding: '10px 20px',
        border: '2px dotted #333', // Dotted border with color #333
        borderRadius: '5px', // Rounded corners with a radius of 5 pixels
        background: 'transparent', // Transparent background to show the dotted border
        color: '#333', // Text color
        cursor: 'pointer', // Show pointer cursor on hover
        outline: 'none', // Remove default focus outline
        margin: "20px"
    },
};
