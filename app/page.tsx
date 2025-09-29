import AppButton from "@/components/app/buttons/app";
import Header from "@/components/globals/header";
import Container from "@/components/layouts/container";

export default function page() {
  return (
    <div>
      <Header />
      <main>
        <Container>
          <div className="flex flex-col gap-4 items-center pt-24">
            <span className="border border-border inline-block rounded-full px-[.75em] py-[.5em] text-xs">
              🎯 Introducing Simple Todo App
            </span>
            <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center font-semibold">
              Take control of your day, one task at a time and actually finish
              what matters.
            </h1>
            <AppButton />
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
          </div>
        </Container>
      </main>
    </div>
  );
}
