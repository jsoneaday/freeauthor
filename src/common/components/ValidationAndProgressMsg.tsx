import { Spinner } from "./Spinner";

interface ValidationAndProgressMsgProps {
  validationMsg: string;
  progressStartMsg: string;
}

export function ValidationAndProgressMsg({
  validationMsg,
  progressStartMsg,
}: ValidationAndProgressMsgProps) {
  return (
    <>
      {validationMsg ? (
        <>
          <span style={{ color: "var(--warning-cl)" }}>{validationMsg}</span>
          {validationMsg === progressStartMsg ? (
            <Spinner size={18} style={{ marginLeft: "1em" }} />
          ) : null}
        </>
      ) : null}
    </>
  );
}
