import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ImagesBrowser from "./components/ImagesBrowser";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="bg-red-400 w-screen h-screen grid place-items-center">
        <ImagesBrowser />
      </main>
    </QueryClientProvider>
  );
}

export default App;
