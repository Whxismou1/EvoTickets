import Nav from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
          <p className="text-lg mb-8">Welcome to the admin page!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
