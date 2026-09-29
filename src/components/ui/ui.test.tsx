import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Field } from "@/components/ui/Field";
import { Poster } from "@/components/ui/Poster";
import { Rail } from "@/components/ui/Rail";
import { renderWithProviders } from "@/test/render";

describe("Field", () => {
  it("labels the input and links the error message to it", () => {
    renderWithProviders(<Field label="Email" type="email" error="Ingresá un email válido." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Ingresá un email válido.");
  });

  it("uses the hint as description when there is no error", () => {
    renderWithProviders(<Field label="Contraseña" hint="Al menos 6 caracteres." />);
    const input = screen.getByLabelText("Contraseña");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveAccessibleDescription("Al menos 6 caracteres.");
  });
});

describe("Poster", () => {
  it("shows the title on an empty frame when TMDB has no poster", () => {
    renderWithProviders(<Poster path={null} title="Película rara" sizes="200px" />);
    expect(screen.getByText("Película rara")).toBeInTheDocument();
    expect(screen.getByText("Sin afiche")).toBeInTheDocument();
  });

  it("falls back to the empty frame when the image fails to load", () => {
    const { container } = renderWithProviders(
      <Poster path="/roto.jpg" title="Afiche roto" sizes="200px" />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("srcset", expect.stringContaining("w342/roto.jpg 342w"));
    fireEvent.error(img!);
    expect(screen.getByText("Afiche roto")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});

describe("EdgeCode", () => {
  it("prints only the fields that exist", () => {
    renderWithProviders(
      <EdgeCode items={[{ label: "Película", emphasis: true }, null, { label: "1999" }, false]} />,
    );
    expect(screen.getByText("Película")).toBeInTheDocument();
    expect(screen.getByText("1999")).toBeInTheDocument();
    expect(screen.getByText("1999").parentElement?.textContent).toBe("Película1999");
  });
});

describe("Rail", () => {
  it("names its region and controls after the title and counts frames", () => {
    renderWithProviders(
      <Rail
        title="En cartel"
        items={["a", "b", "c"]}
        getKey={(item) => item}
        renderItem={(item) => <span>{item}</span>}
      />,
    );
    expect(screen.getByRole("region", { name: "En cartel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anteriores en En cartel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Siguientes en En cartel" })).toBeEnabled();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    // jsdom has no layout: only the first frame counts as visible there.
    expect(screen.getByText(/Mostrando/)).toHaveTextContent("Mostrando 1 a 1 de 3");
  });
});

describe("ButtonLink", () => {
  it("stays a real link for navigation", () => {
    renderWithProviders(<ButtonLink to="/peliculas">Ver películas</ButtonLink>);
    expect(screen.getByRole("link", { name: "Ver películas" })).toHaveAttribute(
      "href",
      "/peliculas",
    );
  });
});
