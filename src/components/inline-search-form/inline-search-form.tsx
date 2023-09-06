import React, { useState } from "react";

import cn from "classnames";

import { Button, Input } from "@mtfh/common";

interface Props {
  onSubmit: (searchText: string) => void;
  className?: string;
  loading: boolean;
  fieldName: string;
}

// Cant use form tags inside existing form
export const InlineSearchForm = ({ onSubmit, className, loading, fieldName }: Props) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (loading) return;

    if (input === "" || input.length < 2) {
      setError("You must enter at least 2 characters.");
      return;
    }

    setError(null);
    onSubmit(input);
  };

  return (
    <div className={className ?? ""}>
      <div
        className={cn("govuk-form-group  lbh-form-group visually-hidden-label", {
          "govuk-form-group--error": error,
        })}
      >
        {error && (
          <span className="govuk-error-message lbh-error-message" aria-hidden="true">
            {error}
          </span>
        )}

        <Input
          style={{ maxWidth: "100%" }}
          onKeyPress={(e) => handleKeyPress(e)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          error={!!error}
          data-testid={`${fieldName}-search-input`}
        />
      </div>

      <Button type="button" onClick={handleSubmit}>
        Search
      </Button>
    </div>
  );
};
