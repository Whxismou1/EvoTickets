import Nav from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventManagerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Manager Page</h1>
          <p className="text-lg mb-8">Welcome to the event manager page!</p>
        </div>
      </main>
      <Footer />
    </div>
  ); 
}
