import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  redirect: vi.fn(),
}));

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("loading starts true", () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.loading).toBe(true);
  });

  it("loading resets to false if getSession throws", async () => {
    getSessionMock.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("user is null on failed session", async () => {
    getSessionMock.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("loading resets to false on success", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
