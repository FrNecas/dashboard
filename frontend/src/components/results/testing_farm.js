import React, { useState, useEffect } from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    Label,
} from "@patternfly/react-core";

import ConnectionError from "../error";
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import { TFStatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";

const ResultsPageTestingFarm = (props) => {
    let id = props.match.params.id;

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/testing-farm/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    if (!loaded) {
        return <Preloader />;
    }

    // console.log(data);

    if ("error" in data) {
        return (
            <PageSection>
                <Card>
                    <CardBody>
                        <Title headingLevel="h1" size="lg">
                            Not Found.
                        </Title>
                    </CardBody>
                </Card>
            </PageSection>
        );
    }

    const statusWithLink = data.web_url ? (
        <a href={data.web_url}>{data.status}</a>
    ) : (
        <>{data.status}</>
    );

    const coprBuildInfo = data.copr_build_id ? (
        <tr>
            <td>
                <strong>COPR build</strong>
            </td>
            <td>
                <a href={`/results/copr-builds/${data.copr_build_id}`}>
                    Details
                </a>
            </td>
        </tr>
    ) : (
        ""
    );

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Testing Farm Results</Text>
                    <TFStatusLabel
                        status={data.status}
                        target={data.chroot}
                        link={data.web_url}
                    />
                    <Text component="p">
                        <strong>
                            <TriggerLink builds={data} />
                        </strong>
                        <br />
                    </Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        <table
                            className="pf-c-table pf-m-compact pf-m-grid-md"
                            role="grid"
                            aria-label="Testing farm table"
                        >
                            <tbody role="rowgroup">
                                <tr>
                                    <td>
                                        <strong>Status</strong>
                                    </td>
                                    <td>{statusWithLink}</td>
                                </tr>
                                {coprBuildInfo}
                                <tr>
                                    <td>
                                        <strong>Pipeline ID</strong>
                                    </td>
                                    <td>{data.pipeline_id}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Commit SHA</strong>
                                    </td>
                                    <td>{data.commit_sha}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { ResultsPageTestingFarm };
