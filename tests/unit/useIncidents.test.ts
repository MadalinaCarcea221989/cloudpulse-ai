import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useIncidents } from "@/hooks/useIncidents";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  redirect: vi.fn(),
}));

const limitMock = vi.fn();
const orderMock = vi.fn();
const selectMock = vi.fn();
const fromMock = vi.fn();
const channelMock = vi.fn();
const removeChannelMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: fromMock,
    channel: channelMock,
    removeChannel: removeChannelMock,
  },
}));

const chain = {
  select: selectMock,
  order: orderMock,
  limit: limitMock,
};

selectMock.mockReturnValue(chain);
orderMock.mockReturnValue(chain);
fromMock.mockReturnValue(chain);

channelMock.mockReturnValue({
  on: () => ({
    on: () => ({
      subscribe: vi.fn(),
    }),
  }),
});

describe("useIncidents", () => {
  beforeEach(() => {
    limitMock.mockReset();
  });

  it("returns loading true initially", () => {
    limitMock.mockResolvedValue({ data: [], error: null });
    const { result } = renderHook(() => useIncidents());
    expect(result.current.loading).toBe(true);
  });

  it("returns incidents array on success", async () => {
    limitMock.mockResolvedValue({
      data: [
        {
          id: "1",
          provider: "aws",
          provider_incident_id: null,
          service: "Lambda",
          region: "us-east-1",
          severity: "critical",
          description: "desc",
          title: "title",
          status: "monitoring",
          started_at: null,
          resolved_at: null,
          cloud_account_id: null,
          raw_json: null,
          created_at: new Date().toISOString(),
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => useIncidents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.incidents.length).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("returns error state on Supabase failure", async () => {
    limitMock.mockResolvedValue({ data: null, error: { message: "Boom" } });

    const { result } = renderHook(() => useIncidents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Boom");
  });

  it("loading resets to false on error", async () => {
    limitMock.mockResolvedValue({ data: null, error: { message: "Failed" } });

    const { result } = renderHook(() => useIncidents());

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("loading resets to false on success", async () => {
    limitMock.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useIncidents());

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
