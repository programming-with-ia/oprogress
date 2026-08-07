import DemoProviders from './demo-providers';

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoProviders>{children}</DemoProviders>;
}