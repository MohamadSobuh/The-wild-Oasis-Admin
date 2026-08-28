import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Settings() {
  return (
    <div>
      <Row>
        <Heading as="h1">Update hotel settings</Heading>
      </Row>
      <Row type="margin">
        <UpdateSettingsForm />
      </Row>
    </div>
  );
}

export default Settings;
