import AppButton from "@/components/app/buttons/app";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SignInForm } from "@/components/auth/signin-form";
import { SignUpForm } from "@/components/auth/signup-form";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import Header from "@/components/globals/header";
import Container from "@/components/layouts/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import config from "@/config";
import { withBase } from "@/utils/auth";
import { notFound } from "next/navigation";

type TParams = Awaited<PageProps<"/[[...slug]]">["params"]>;
type TSearchParams = Awaited<PageProps<"/[[...slug]]">["searchParams"]>;
type TPageProps = {
  params: TParams;
  searchParams: TSearchParams;
};

function RenderIndexPage() {
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

function RenderAuthPage(props: TPageProps) {
  const { slug } = props.params;
  const path = `/${slug!.join("/")}`;

  if (path.startsWith(withBase(config.auth.pages.signin.name))) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignInForm />
        </div>
      </div>
    );
  }

  if (path.startsWith(withBase(config.auth.pages.signup.name))) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    );
  }

  if (path.startsWith(withBase(config.auth.pages["reset-password"].name))) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ResetPasswordForm />
        </div>
      </div>
    );
  }

  if (path.startsWith(withBase(config.auth.pages["update-password"].name))) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <UpdatePasswordForm />
        </div>
      </div>
    );
  }

  if (path.startsWith(withBase(config.auth.pages.error.name))) {
    const { searchParams } = props;

    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Sorry, something went wrong.
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchParams?.error ? (
                  <p className="text-sm text-muted-foreground">
                    Code error: {searchParams.error}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    An unspecified error occurred.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (path.startsWith(withBase(config.auth.pages["signup-success"].name))) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Thank you for signing up!
                </CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve successfully signed up. Please check your email to
                  confirm your account before signing in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default async function page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { slug } = params;
  const path = slug === undefined ? "/" : `/${slug.join("/")}`;

  if (path === "/") {
    return <RenderIndexPage />;
  }

  if (path.startsWith(`/${config.auth.base}`)) {
    return <RenderAuthPage params={params} searchParams={searchParams} />;
  }

  notFound();
}
