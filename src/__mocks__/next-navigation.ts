export const usePathname = jest.fn();
export const useRouter = jest.fn();

type NextNavigationOptions = {
  pathname?: string;
  push?: jest.Mock;
};

export function mockNextNavigation({
  pathname = "/",
  push = jest.fn(),
}: NextNavigationOptions = {}) {
  usePathname.mockReturnValue(pathname);
  useRouter.mockReturnValue({ push });

  return { push };
}